import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileDevice } from "@/types/booking";

interface SelectedDeviceProps {
  device: MobileDevice;
  onChangeDevice: () => void;
}

const SelectedDevice = ({ device, onChangeDevice }: SelectedDeviceProps) => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-md">
      <CardHeader>
        <CardTitle>Selected Device</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-4 py-2 bg-white shadow-sm">
            {device.brand} {device.model}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onChangeDevice}
          >
            Change Device
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SelectedDevice;