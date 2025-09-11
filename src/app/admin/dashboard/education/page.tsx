
import { EducationForm } from "@/components/admin/education-form";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EducationAdminPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Formations</CardTitle>
                <CardDescription>Gérez les formations et diplômes affichés sur votre CV. Vous pouvez les réorganiser par glisser-déposer.</CardDescription>
            </CardHeader>
            <EducationForm />
        </Card>
    )
}
