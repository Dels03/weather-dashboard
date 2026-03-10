import { useParams } from "react-router-dom";
import { useCityWeather } from "../../hooks/useCityWeather";
import { useCityPhoto } from "../../hooks/useCityPhoto"; // Unsplash integration
import WeatherCard from "../../components/WeatherCard";
import HourlyForecast from "./components/HourlyForecast";
import DetailsGrid from "./components/DetailsGrid";
import { Skeleton } from "../../components/ui/Skeleton";

const CityDetails = () => {
  const { cityId } = useParams(); // e.g., "london"
  const { current, daily, hourly, loading, error } = useCityWeather(cityId);
  const { photoUrl, loading: photoLoading } = useCityPhoto(cityId);

  if (loading) return <Skeleton className="h-screen" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      {photoUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={photoUrl}
            alt={cityId}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <WeatherCard weather={current} />
        <HourlyForecast data={hourly} />
        <DetailsGrid data={current} />
      </div>
    </div>
  );
};

export default CityDetails;
