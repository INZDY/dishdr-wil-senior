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
  dialogOpen,
  setDialogOpen,
  symptomDetails,
  setSymptomDetails,
  selectionType,
  chiefValue,
  presentValue,
  handleSaveChanges,
}: SymptomDialogProps) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Symptom Details</DialogTitle>
          <DialogDescription>
            Fill details for the selected symptom.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="symptom" className="text-right">
              Symptom
            </Label>
            <Input
              id="symptom"
              defaultValue={symptomDetails?.name}
              disabled={
                selectionType === "chief"
                  ? chiefValue !== "other"
                  : presentValue !== "other"
              }
              onChange={(e) => {
                symptomDetails != undefined
                  ? setSymptomDetails({
                      ...symptomDetails,
                      name: e.target.value,
                    })
                  : null;
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
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
              onValueChange={(unit) => {
                symptomDetails != undefined
                  ? setSymptomDetails({ ...symptomDetails, unit: unit })
                  : null;
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">days</SelectItem>
                <SelectItem value="hours">hours</SelectItem>
                <SelectItem value="minutes">minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveChanges}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
