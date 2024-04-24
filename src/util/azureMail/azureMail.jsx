/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import { axiosInstance, headers } from "../axiosConfig";
import Swal from "sweetalert2";
import toast from "react-hot-toast";


const AzureMail = async (props) => {
    const { to, subject, message, cc } = props;


    const final_data = {
        "APIKey": "4d077657-xqea-5648-whhp-5d3b2d1aed0d",
        "to": to,
        "cc":cc,
        "subject": subject,
        "body": message,
    }
    // Call your Azure API for production environment
    await axiosInstance.post("https://prod-174.westus.logic.azure.com:443/workflows/4bc9f4f8eae54d41825143694d1a963d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=00PfC8x7zzEKINBuF1K_RKA4W7Xav9ebw8RXYDpWn-c", final_data, { headers })
        .then((res) => {
            toast.dismiss();
            if (res.status === 200) {
                return (true);
            } else {
                throw new Error("Unexpected response status: " + res.status);
            }
        })
        .catch((error) => {
            toast.dismiss();
            Swal.fire({
                icon: "warning",
                title: "failed!",
                text: "Try After Sometime." + error.message,
            });
            return (false);
        });




};

export default AzureMail;
