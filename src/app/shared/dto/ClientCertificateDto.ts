import { CertificateInfo } from "src/app/plan/interfaces/plan";

export class ClientCertificateDto {
    idClient?: number;
    certificadoDtoList: CertificateInfo[] = [];
}  