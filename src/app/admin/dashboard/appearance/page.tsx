
import { AppearanceForm } from "@/components/admin/appearance-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppearanceAdminPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Apparence du site</CardTitle>
                <CardDescription>Choisissez une palette de couleurs pour personnaliser l'apparence de votre CV public.</CardDescription>
            </CardHeader>
            <AppearanceForm />
        </Card>
    )
}
