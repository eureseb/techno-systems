import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/remarks`;

const RemarksService = {
  /// GET /ratings
  all: () => api.get(`${BASE_URL}`),

  /// POST /meetings
  /*
    data: {
      "classroom_id": "int",
      "owner_id": "int",
      "name": "string",
      "description": "string",
      "teacher_weight_score": "decimal",
      "student_weight_score": "decimal",
    }
  */
  create: (data) => api.post(BASE_URL, data),

  /// GET /meetings/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),

  getAccountRemarksForPresentor: (meetingId, pitchId) => api.get(`${BASE_URL}/my_remarks/?meeting=${meetingId}&pitch=${pitchId}`)
};

export default RemarksService;
