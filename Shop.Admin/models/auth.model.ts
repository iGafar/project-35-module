import axios from "axios";
import { IAuthRequisits } from "@Shared/types";
import { API_HOST } from "./const";

export async function verifyRequisits(
  requisites: IAuthRequisits
): Promise<boolean> {
  try {
    const { status } = await axios.post(`${API_HOST}/auth`, requisites);
    return status === 200;
  } catch (e) {
    return false;
  }
}
