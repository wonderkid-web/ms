
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Paperclip } from "lucide-react";

export default function QuisionerCard({ quisioner }: { quisioner: any }) {
    return (
        <Link href={`/user/quisioner/${quisioner.id}`}>
            <Card className="hover:border-emerald-500 transition-all duration-300 ease-in-out">
                <CardHeader className="flex justify-between">
                    <CardTitle className="text-emerald-800">{quisioner.title}</CardTitle>
                    <Paperclip />
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{quisioner.description}</p>
                    <div className="flex justify-between items-center">
                        <Badge variant={quisioner.status === 'published' ? 'default' : 'outline'}>
                            {quisioner.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                            <span>{format(new Date(quisioner.startDate), "LLL dd, y")} - {format(new Date(quisioner.endDate), "LLL dd, y")}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
