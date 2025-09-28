import { Card } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        <Card className="p-8 animate-scale-in">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Account Information:</strong> When you create an account, we collect your email address, name, and profile information you choose to provide.
                  </p>
                  <p>
                    <strong className="text-foreground">Usage Data:</strong> We collect information about how you use our services, including prayer time preferences, Quran reading progress, and calculator usage.
                  </p>
                  <p>
                    <strong className="text-foreground">Location Data:</strong> With your permission, we collect location data to provide accurate prayer times and Qibla direction.
                  </p>
                  <p>
                    <strong className="text-foreground">Communication:</strong> Messages sent through our Scholar Assistant feature are stored to maintain conversation history and improve our services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>To provide and maintain our Islamic companion services</li>
                  <li>To calculate accurate prayer times for your location</li>
                  <li>To save your Quran reading progress and bookmarks</li>
                  <li>To provide personalized Islamic guidance through our Scholar Assistant</li>
                  <li>To send you prayer time notifications (if enabled)</li>
                  <li>To improve our services and develop new features</li>
                  <li>To communicate with you about updates and important information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Data Protection</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted both in transit and at rest.
                  </p>
                  <p>
                    We use Supabase as our backend service provider, which is SOC 2 Type II certified and complies with GDPR requirements.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Third-Party Services</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Authentication:</strong> We use Google OAuth for secure authentication. Google's privacy policy applies to information collected through their services.
                  </p>
                  <p>
                    <strong className="text-foreground">AI Services:</strong> Our Scholar Assistant uses OpenRouter API to provide Islamic guidance. Conversations are processed according to their privacy policy.
                  </p>
                  <p>
                    <strong className="text-foreground">Prayer Times:</strong> We use external APIs to calculate prayer times based on your location.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Your Rights</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Access:</strong> You can access and view your personal data through your account dashboard</li>
                  <li><strong className="text-foreground">Correction:</strong> You can update your profile information at any time</li>
                  <li><strong className="text-foreground">Deletion:</strong> You can request deletion of your account and associated data</li>
                  <li><strong className="text-foreground">Portability:</strong> You can request a copy of your data in a machine-readable format</li>
                  <li><strong className="text-foreground">Opt-out:</strong> You can disable notifications and data collection features</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your personal data for as long as your account is active or as needed to provide you services. 
                  If you delete your account, we will delete your personal data within 30 days, except where we are 
                  required by law to retain certain information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for children under 13. We do not knowingly collect personal 
                  information from children under 13. If you believe we have collected information from a child 
                  under 13, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify you of any changes by 
                  posting the new policy on this page and updating the "Last Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-border/50">
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-foreground">Email:</strong> <a href="mailto:shankp562@gmail.com" className="text-primary hover:underline">shankp562@gmail.com</a></p>
                    <p><strong className="text-foreground">Phone:</strong> <a href="tel:+919961512525" className="text-primary hover:underline">+91 9961512525</a></p>
                    <p><strong className="text-foreground">Location:</strong> Biyyam Lake, Kerala, India</p>
                  </div>
                </div>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;