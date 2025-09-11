
import { ExperienceForm } from "@/components/admin/experience-form";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ExperienceAdminPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Expériences Professionnelles</CardTitle>
                <CardDescription>Gérez les expériences affichées sur votre CV. Vous pouvez les réorganiser par glisser-déposer.</CardDescription>
            </CardHeader>
            <ExperienceForm />
        </Card>
    )
}
