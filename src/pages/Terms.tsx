import { Card } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms carefully before using HalalNest services.
          </p>
        </div>

        <Card className="p-8 animate-scale-in">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using HalalNest ("the Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Description of Service</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    HalalNest is an Islamic companion application that provides:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Prayer time calculations and notifications</li>
                    <li>Holy Quran reading with translations and audio</li>
                    <li>Islamic calculators (Zakat, inheritance, etc.)</li>
                    <li>AI-powered Scholar Assistant for Islamic guidance</li>
                    <li>Community features and Islamic articles</li>
                    <li>Qibla direction finder</li>
                    <li>Islamic resources and educational content</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">User Obligations</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate and complete information when creating an account</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Use the service in accordance with Islamic principles and values</li>
                    <li>Not use the service for any unlawful or prohibited activities</li>
                    <li>Respect other users and maintain Islamic etiquette in community interactions</li>
                    <li>Not attempt to interfere with or disrupt the service</li>
                    <li>Not use automated systems to access the service without permission</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Religious Guidance Disclaimer</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 my-6">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Important Notice</h3>
                  <div className="text-yellow-700 dark:text-yellow-300 space-y-3">
                    <p>
                      The Scholar Assistant and other religious guidance features are provided for general educational 
                      purposes only. While we strive to provide authentic Islamic guidance based on Quran and Sunnah:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>AI responses may contain errors or may not apply to your specific situation</li>
                      <li>For important religious matters, always consult qualified Islamic scholars</li>
                      <li>Prayer times are calculated estimates and may require local verification</li>
                      <li>Calculator results should be verified for important financial decisions</li>
                    </ul>
                    <p className="font-semibold">
                      HalalNest is not a substitute for proper Islamic education or scholarly consultation.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Intellectual Property</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The service and its original content, features, and functionality are owned by HalalNest and are 
                    protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p>
                    Islamic texts (Quran verses, Hadith) are considered sacred knowledge belonging to the Muslim Ummah. 
                    We present these texts respectfully for educational and worship purposes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Privacy and Data</h2>
                <p className="text-muted-foreground">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of 
                  the service, to understand our practices regarding your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Prohibited Uses</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You may not use our service:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To upload or transmit viruses or any other type of malicious code</li>
                    <li>To promote content contrary to Islamic teachings and values</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your access immediately, without prior notice or liability, for any reason 
                  whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use 
                  the service will cease immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  In no event shall HalalNest, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                  limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                  of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
                  revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be interpreted and governed by the laws of India, and you submit to the jurisdiction 
                  of the state and federal courts located in Kerala, India for the resolution of any disputes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Contact Information</h2>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-border/50">
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about these Terms & Conditions, please contact us:
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

export default Terms;