import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface ActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: string[];
  onSubmit?: (selected: string[], etc: string) => void;
}

export function ActionModal({
  open,
  onOpenChange,
  actions,
  onSubmit,
}: ActionModalProps) {
  const [checked, setChecked] = useState<boolean[]>(actions.map(() => false));
  const [etc, setEtc] = useState("");

  const handleCheck = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleSubmit = () => {
    const selected = actions.filter((_, i) => checked[i]);
    onSubmit?.(selected, etc);
    onOpenChange(false);
    setChecked(actions.map(() => false));
    setEtc("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setChecked(actions.map(() => false));
    setEtc("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl p-0 w-[90vw] max-w-xs">
        <DialogHeader className="pt-6 pb-2 px-0">
          <DialogTitle className="text-center text-base font-bold">권장 조치</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 px-0 pb-0">
          {actions.map((action, idx) => (
            <label
              key={action}
              className="flex items-center px-6 py-2 cursor-pointer"
            >
              <Checkbox
                checked={checked[idx]}
                onCheckedChange={() => handleCheck(idx)}
                className="mr-2"
              />
              <span className="text-blue-600 font-medium">{action}</span>
            </label>
          ))}
          <div className="px-6 py-2">
            <Input
              placeholder="기타"
              value={etc}
              onChange={(e) => setEtc(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter className="px-6 pb-4 pt-2 flex flex-row gap-2">
          <Button className="flex-1" variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActionModal;
