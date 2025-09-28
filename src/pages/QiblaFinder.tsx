import { useState, useEffect } from 'react';
import { ArrowLeft, Compass, Navigation, MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const QiblaFinder = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compass, setCompass] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = () => {
    setLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          calculateQiblaDirection(lat, lng);
          setLoading(false);
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const calculateQiblaDirection = (lat: number, lng: number) => {
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    
    // Convert to radians
    const phi1 = lat * Math.PI / 180;
    const phi2 = kaabaLat * Math.PI / 180;
    const deltaLng = (kaabaLng - lng) * Math.PI / 180;
    
    // Calculate bearing
    const y = Math.sin(deltaLng) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLng);
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360; // Normalize to 0-360
    
    setQiblaDirection(bearing);
  };

  useEffect(() => {
    // Listen for device orientation (compass)
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompass(360 - event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const qiblaOffset = qiblaDirection ? (qiblaDirection - compass + 360) % 360 : 0;

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/calculators">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Qibla Direction Finder</h1>
            <p className="text-muted-foreground">Find the direction to Kaaba from your location</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compass Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Compass className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Qibla Compass</h2>
            </div>

            <div className="text-center">
              {!location ? (
                <div className="py-8">
                  <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    To find Qibla direction, we need your current location
                  </p>
                  <Button onClick={getLocation} disabled={loading} className="btn-hero">
                    {loading ? 'Getting Location...' : 'Get My Location'}
                  </Button>
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>
              ) : (
                <div>
                  {/* Compass Circle */}
                  <div className="relative w-64 h-64 mx-auto mb-6">
                    <div className="w-full h-full border-4 border-muted rounded-full relative overflow-hidden">
                      {/* Compass Background */}
                      <div 
                        className="absolute inset-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full"
                        style={{ transform: `rotate(${-compass}deg)` }}
                      >
                        {/* North Marker */}
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-primary font-bold text-sm">
                          N
                        </div>
                      </div>
                      
                      {/* Qibla Direction Arrow */}
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 bg-secondary origin-bottom"
                        style={{ 
                          height: '100px',
                          transform: `translate(-50%, -100%) rotate(${qiblaOffset}deg)`
                        }}
                      >
                        <Target className="w-6 h-6 text-secondary absolute -top-3 -left-2.5" />
                      </div>
                      
                      {/* Center Dot */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                  </div>

                  {qiblaDirection && (
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-primary">
                        Qibla Direction: {qiblaDirection.toFixed(1)}°
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Point your device towards the green arrow
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Information Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Navigation className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold">Location Information</h2>
            </div>

            {location ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Your Coordinates</h3>
                  <p className="text-sm text-muted-foreground">
                    Latitude: {location.lat.toFixed(6)}°<br />
                    Longitude: {location.lng.toFixed(6)}°
                  </p>
                </div>

                <div className="p-4 bg-secondary/5 rounded-lg">
                  <h3 className="font-semibold text-secondary mb-2">Kaaba Coordinates</h3>
                  <p className="text-sm text-muted-foreground">
                    Latitude: 21.4225°<br />
                    Longitude: 39.8262°<br />
                    Makkah, Saudi Arabia
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Location information will appear here</p>
              </div>
            )}

            <Card className="mt-6 p-4 bg-muted/30">
              <h4 className="font-semibold mb-2">Prayer Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Face the Qibla during all five daily prayers</li>
                <li>• The direction may vary slightly by location</li>
                <li>• Use this as a guide; local mosque direction may differ</li>
                <li>• Ensure device compass is calibrated properly</li>
              </ul>
            </Card>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default QiblaFinder;