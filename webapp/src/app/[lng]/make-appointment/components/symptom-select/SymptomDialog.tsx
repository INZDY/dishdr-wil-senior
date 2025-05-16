import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SymptomAnswer } from "@/types/dataTypes";
import React from "react";

interface SymptomDialogProps {
  lng: string;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  symptomDetails: SymptomAnswer | undefined;
  setSymptomDetails: React.Dispatch<
    React.SetStateAction<SymptomAnswer | undefined>
  >;
  selectionType: string;
  chiefValue: string;
  presentValue: string;
  handleSaveChanges: () => void;
}

export default function SymptomDialog({
  lng,
  dialogOpen,
  setDialogOpen,
  symptomDetails,
  setSymptomDetails,
  selectionType,
  chiefValue,
  presentValue,
  handleSaveChanges,
}: SymptomDialogProps) {
  const { t } = useTranslation(lng, "make-appointment");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("symptom-detail")}</DialogTitle>
          <DialogDescription>{t("symptom-detail-desc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="symptom" className="text-right">
              {t("symptom")}
            </Label>
            <Input
              id="symptom"
              defaultValue={symptomDetails?.symptom}
              disabled={
                selectionType === "chief"
                  ? chiefValue !== "other"
                  : presentValue !== "other"
              }
              onChange={(e) => {
                symptomDetails != undefined
                  ? setSymptomDetails({
                      ...symptomDetails,
                      symptom: e.target.value,
                    })
                  : null;
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              {t("duration")}
            </Label>
            <Input
              id="duration"
              defaultValue={symptomDetails?.duration}
              onChange={(e) => {
                symptomDetails != undefined
                  ? setSymptomDetails({
                      ...symptomDetails,
                      duration: parseInt(e.target.value),
                    })
                  : null;
              }}
            />
            <Select
              defaultValue="day"
              onValueChange={(unit) => {
                symptomDetails != undefined
                  ? setSymptomDetails({ ...symptomDetails, unit: unit })
                  : null;
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{t("week")}</SelectItem>
                <SelectItem value="day">{t("day")}</SelectItem>
                <SelectItem value="hour">{t("hour")}</SelectItem>
                <SelectItem value="minute">{t("minute")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveChanges}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
