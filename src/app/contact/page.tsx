
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 animate-fade-in">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
            <Mail className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This is a placeholder for your "Contact Us" page. 
          </p>
          <p>
            You can add a contact form, your business address, phone number, and email address here. Let your customers know the best way to reach you.
          </p>
           <p>
            You can easily edit this content by opening the file at <code className="font-code bg-muted px-1 py-0.5 rounded text-sm">src/app/contact/page.tsx</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
