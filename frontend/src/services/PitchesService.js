import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/pitches`;

const PitchesService = {
  /// GET /pitches
  all: () => api.get(BASE_URL),

  /// POST /pitches
  /*
    data: {
      "team_id": "int",
      "name": "string",
      "description": "string",
      "team": "json object"
    }
  */
  create: (data) => api.post(BASE_URL, data),

  /// GET /classes/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),
};

export default PitchesService;
