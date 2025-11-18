import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Sparkles } from "lucide-react"

export default function ProviderPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-3xl font-bold text-foreground">Moment</span>
          </Link>
        </div>

        <Card className="border-2 text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription className="text-base">Your service provider application is under review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Our admin team will review your application to ensure quality standards. You'll receive an email
              notification once your account is approved.
            </p>
            <p className="text-sm text-muted-foreground">This usually takes 1-2 business days.</p>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
