import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CriteriasServices } from '../services';

const useCriterias = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [criterias, setCriterias] = useState([]);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedCriterias;

      try {
        const res = await CriteriasServices.all();

        responseCode = res?.status;
        retrievedPitches = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setCriterias(retrievedCriterias);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }

      setIsLoading(false);
    };

    get();
  }, []);

  return { isLoading, criterias };
};

export default useCriterias;
