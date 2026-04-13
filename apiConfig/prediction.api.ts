import { AuthResponseT } from "@/types/auth.type";
import apiConfig from "./apiConfig";

export const submitPrediction = async (
  matchId: number,
  vote: "HOME" | "DRAW" | "AWAY"
) => {
  try {
    const res = await apiConfig.post(`/matches/${matchId}/vote/key`, {
      vote: vote,
    });
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: "Failed to submit prediction",
      error: e.response?.data?.message || e.message,
    };
  }
};

// no need
export const voteScorePrediction = async (
  matchId: number,
  score_option_id: number
): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.post(
      `/matches/${matchId}/score-predictions/key`,
      {
        score_option_id,
      }
    );

    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: "Failed to submit score prediction",
      error: e.response?.data?.message || e.message,
    };
  }
};

//no need
export const getScorePredictions = async (
  matchId: number
): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.get(
      `/matches/${matchId}/score-options-predictions`
    );
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: "Failed to fetch score predictions",
      error: e.response?.data?.message || e.message,
    };
  }
};

// // Get current user's score prediction for a match (optional)
// export const getUserScorePredictionForMatch = async (
//   matchId: number,
//   userId: string
// ): Promise<AuthResponseT> => {
//   try {
//     const res = await apiConfig.get(
//       `/matches/${matchId}/predictions/user/${userId}`
//     );

//     return res.data;
//   } catch (e: any) {
//     return {
//       success: false,
//       message: "Failed to fetch user score prediction",
//       error: e.response?.data?.message || e.message,
//     };
//   }
// };
