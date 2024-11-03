import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

interface AcceptTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: {
    id: string;
    noSEP: string;
    user: {
      nama: string;
      nik: string;
    };
    sourceFaskes: string;
    transferReason: string;
    recordKesehatan: {
      diagnosaAwal: string;
    };
  } | null;
  onAccept: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const AcceptTransferModal = ({
  isOpen,
  onClose,
  transfer,
  onAccept,
  isLoading,
}: AcceptTransferModalProps) => {
  if (!transfer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Penerimaan Transfer</DialogTitle>
          <DialogDescription>
            Tinjau detail transfer sebelum menerima
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">No. SEP</p>
              <p className="text-sm">{transfer.noSEP}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Faskes Asal</p>
              <p className="text-sm">{transfer.sourceFaskes}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Data Pasien
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium">{transfer.user.nama}</p>
              <p className="text-sm text-gray-600">{transfer.user.nik}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Diagnosa Awal
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{transfer.recordKesehatan.diagnosaAwal}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Alasan Transfer
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{transfer.transferReason}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            onClick={() => onAccept(transfer.id)}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Terima Transfer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
