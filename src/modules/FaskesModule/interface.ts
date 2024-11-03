export interface TransferStats {
  totalTransfers: number;
  pendingTransfers: number;
  acceptedTransfers: number;
  recentTransfers: Array<{
    id: string;
    noSEP: string;
    status: string;
    transferTime: string;
    sourceFaskes: string;
    destinationFaskes: string;
    user: {
      nama: string;
    };
  }>;
}

export interface Record {
  noSEP: string;
  userNIK: string;
  jenisRawat: string;
  diagnosaAwal: string;
  diagnosaPrimer: string;
  icdX: string;
  tindakan: string;
  tanggalMasuk: string;
  hashCurrent: string;
  blockchainVerified: boolean;
  user: {
    nama: string;
    nik: string;
  };
}
