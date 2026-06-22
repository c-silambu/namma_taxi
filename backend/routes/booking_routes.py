from datetime import datetime
import requests
from flask import Blueprint, current_app, jsonify, request, session
from sqlalchemy.orm import joinedload
from backend.database.db import db
from backend.middlewares.auth_middleware import user_required
from backend.models.models import Car, Trip
from backend.utils.helpers import calculate_fare, generate_otp, safe_float, safe_int

booking_bp = Blueprint('booking', __name__)


def verify_turnstile(token):
    """Verify Cloudflare Turnstile token. If secret is not configured, allow local development."""
    secret = current_app.config.get('TURNSTILE_SECRET_KEY')
    if not secret:
        return True
    if not token:
        return False
    try:
        response = requests.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            data={
                'secret': secret,
                'response': token,
                'remoteip': request.headers.get('CF-Connecting-IP') or request.remote_addr,
            },
            timeout=8,
        )
        result = response.json()
        return bool(result.get('success'))
    except Exception:
        return False


@booking_bp.route('/api/my_trips', methods=['GET'])
@user_required
def my_trips():
    trips = (Trip.query
             .options(joinedload(Trip.driver), joinedload(Trip.car))
             .filter_by(customer_email=session['user_email'])
             .order_by(Trip.id.desc())
             .all())
    return jsonify([t.to_dict() for t in trips])


@booking_bp.route('/api/booknow', methods=['POST'])
@user_required
def booknow():
    data = request.get_json(silent=True) or {}

    if not verify_turnstile(data.get('captcha_token')):
        return jsonify({'success': False, 'message': 'Robot verification failed. Please tick I am not a robot again.'}), 400

    distance_km = safe_float(data.get('distance_km'), 0)
    car_type = data.get('car_type', 'ac')
    fare_type = data.get('fare_type', 'per_km')
    total_fare = safe_float(data.get('total_fare'), 0) or calculate_fare(distance_km, car_type, fare_type)
    otp = generate_otp()

    trip = Trip(
        driver_id=data.get('driver_id') or None,
        car_id=data.get('car_id') or None,
        pickup_location=data.get('pickup_location'),
        drop_location=data.get('drop_location'),
        trip_date=data.get('trip_date'),
        drop_time=data.get('drop_time'),
        distance_km=distance_km,
        fare_type=fare_type,
        car_type=car_type,
        vehicle_category=data.get('vehicle_category', 'mini'),
        trip_type=data.get('trip_type', 'one_way'),
        total_fare=total_fare,
        customer_name=data.get('customer_name'),
        customer_email=session['user_email'],
        customer_phone=data.get('customer_phone'),
        customer_age=None,
        notes=data.get('trip_notes', ''),
        passengers_accompanying=safe_int(data.get('passengers_accompanying'), 1),
        status='Pending',
        otp=otp,
        created_at=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    db.session.add(trip)
    if trip.car_id:
        car = Car.query.get(trip.car_id)
        if car:
            car.status = 'booked'
    db.session.commit()
    return jsonify({'success': True, 'message': 'Booking confirmed!', 'trip': trip.to_dict(), 'otp': otp})


@booking_bp.route('/api/my_trips/<int:trip_id>/cancel', methods=['POST'])
@user_required
def customer_cancel_trip(trip_id):
    trip = Trip.query.options(joinedload(Trip.car)).get_or_404(trip_id)
    if trip.customer_email != session['user_email']:
        return jsonify({'success': False, 'message': 'Not your trip'}), 403
    if trip.status in ['Trip Completed', 'Cancelled', 'Rejected']:
        return jsonify({'success': False, 'message': 'This trip cannot be cancelled now'})
    data = request.get_json(silent=True) or {}
    reason = (data.get('reason') or '').strip()
    if not reason:
        return jsonify({'success': False, 'message': 'Cancel reason is required'})
    trip.status = 'Cancelled'
    trip.cancel_reason = reason
    trip.cancelled_by = 'Customer'
    if trip.car:
        trip.car.status = 'available'
    db.session.commit()
    return jsonify({'success': True, 'message': 'Trip cancelled', 'trip': trip.to_dict()})
