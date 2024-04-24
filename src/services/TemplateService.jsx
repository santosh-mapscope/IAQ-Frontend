/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import { axiosInstance, headersForJwt } from "../util/axiosConfig";


  export const PreviewPdf = async (data) => {
    return await   axiosInstance
    .post("template/getAllCoverPage", data, {
      headers: headersForJwt,
    },{ responseType: "blob" }) 
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });
  };