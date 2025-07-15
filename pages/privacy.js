import Head from "next/head"
import MainBanner from "../components/MainBanner"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Privacy Notice</h1>
          <p className="text-gray-600 mb-4 text-lg">Last updated July 04, 2025</p>
          <p className="text-gray-600 mb-4 text-lg">
            This Privacy Notice for RWT News LLC ("we," "us," or "our") describes how and why we might access, collect,
            store, use, and/or share ("process") your personal information when you use our services ("Services"),
            including when you visit our website at https://redwhiteandtruenews.com or engage with us in other related
            ways, including any sales, marketing, or events. If you have questions or concerns, please contact us by
            visiting our{" "}
            <a href="/contact" className="text-[#B22234] hover:underline font-semibold">
              Contact Page
            </a>
            .
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Summary of Key Points</h2>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>What personal information do we process?</strong> We may process personal information depending on
              your interaction with our Services, such as names and email addresses.
            </li>
            <li>
              <strong>Do we process sensitive information?</strong> We do not process sensitive personal information.
            </li>
            <li>
              <strong>Do we collect third-party information?</strong> We do not collect information from third parties.
            </li>
            <li>
              <strong>How do we process your information?</strong> We process your information to provide, improve, and
              administer our Services, communicate with you, ensure security, and comply with law.
            </li>
            <li>
              <strong>Who do we share information with?</strong> We may share information in specific situations, such
              as business transfers or with affiliates and business partners.
            </li>
            <li>
              <strong>How do we keep your information safe?</strong> We use organizational and technical measures, but
              no system is 100% secure.
            </li>
            <li>
              <strong>What are your rights?</strong> You may have rights to access, correct, or delete your personal
              information, depending on your location.
            </li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">1. What Information Do We Collect?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            <strong>Personal Information You Disclose to Us:</strong> We collect personal information you voluntarily
            provide, such as names and email addresses, when you engage with our Services or contact us.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            <strong>Sensitive Information:</strong> We do not process sensitive information.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            <strong>Social Media Login Data:</strong> If you register using social media accounts (e.g., Facebook, X),
            we may collect profile information as described in "How Do We Handle Your Social Logins?"
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            <strong>Information Automatically Collected:</strong> We collect device and usage data, such as IP address,
            browser type, and site activity, for security and analytics purposes. We may use cookies and similar
            technologies.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">2. How Do We Process Your Information?</h2>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>To provide and improve our Services</li>
            <li>To communicate with you, including for feedback and marketing (with consent)</li>
            <li>For security and fraud prevention</li>
            <li>To analyze usage trends and improve user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">3. What Legal Bases Do We Rely On?</h2>
          <p className="text-gray-600 mb-4 text-lg">We process your information based on:</p>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Consent:</strong> Where you have given explicit permission.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> For purposes like marketing, analytics, and fraud prevention,
              provided they do not outweigh your rights.
            </li>
            <li>
              <strong>Legal Obligations:</strong> To comply with laws or defend our rights.
            </li>
            <li>
              <strong>Vital Interests:</strong> To protect you or others from harm.
            </li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">
            4. When and With Whom Do We Share Your Personal Information?
          </h2>
          <p className="text-gray-600 mb-4 text-lg">We may share your information in:</p>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Business Transfers:</strong> During mergers, sales, or acquisitions.
            </li>
            <li>
              <strong>Affiliates:</strong> With our parent company or subsidiaries, bound by this Privacy Notice.
            </li>
            <li>
              <strong>Business Partners:</strong> To offer products, services, or promotions.
            </li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">5. What Is Our Stance on Third-Party Websites?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We are not responsible for the privacy practices of third-party websites linked to our Services. Review
            their policies before sharing information.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">
            6. Do We Use Cookies and Other Tracking Technologies?
          </h2>
          <p className="text-gray-600 mb-4 text-lg">
            We may use cookies and tracking technologies for analytics and advertising. You can manage preferences via
            browser settings or opt out of Google Analytics at{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#B22234] hover:underline font-semibold">
              https://tools.google.com/dlpage/gaoptout
            </a>
            .
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">7. How Do We Handle Your Social Logins?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            If you log in via social media, we may receive profile information (e.g., name, email). We use this only as
            described in this Privacy Notice. Review your social media provider’s privacy policies.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">8. How Long Do We Keep Your Information?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We retain your information only as long as necessary for the purposes outlined, unless required by law. Data
            is deleted or anonymized when no longer needed.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">9. How Do We Keep Your Information Safe?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We use reasonable technical and organizational measures to protect your information, but no system is 100%
            secure. Access our Services in a secure environment.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">10. Do We Collect Information from Minors?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We do not knowingly collect data from children under 18. If we learn such data was collected, we will delete
            it promptly.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">11. What Are Your Privacy Rights?</h2>
          <p className="text-gray-600 mb-4 text-lg">Depending on your location, you may have rights to:</p>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>Access and obtain a copy of your personal information</li>
            <li>Request correction or deletion</li>
            <li>Restrict or object to processing</li>
            <li>Request data portability</li>
            <li>Opt out of automated decision-making</li>
          </ul>
          <p className="text-gray-600 mb-4 text-lg">
            Contact us by visiting our{" "}
            <a href="/contact" className="text-[#B22234] hover:underline font-semibold">
              Contact Page
            </a>{" "}
            to exercise these rights.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">12. Controls for Do-Not-Track Features</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We do not currently respond to Do-Not-Track signals, as no uniform standard exists. We will update this
            Privacy Notice if a standard is adopted.
          </p>

          {/* NEW SECTION 13: Third-Party Video Services */}
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">13. Third-Party Video Services</h2>
          <p className="text-gray-600 mb-4 text-lg">
            This Privacy Policy explains how Red, White and True News collects, uses, and shares your information.
            Please note that our website uses YouTube API Services to display video content. By interacting with our
            video features, you are also subject to the{" "}
            <a
              href="http://www.google.com/policies/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B22234] hover:underline font-medium"
            >
              Google Privacy Policy
            </a>
            .
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            **What Information We Access, Collect, Store, and Use:**
            <br />
            When you view videos on our site, we do not directly collect any personal information from you related to
            your YouTube activity. However, the embedded YouTube player, as part of the YouTube API Services, may
            access, collect, store, or otherwise use information directly or indirectly on or from your devices. This
            can include placing, accessing, or recognizing cookies or similar technologies on your devices or browsers.
            This data collection is governed by Google's Privacy Policy.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            **How Information is Used, Processed, and Shared:**
            <br />
            Information collected by YouTube API Services (e.g., your IP address, device information, viewing habits) is
            used by Google to provide and improve their services, including serving relevant content and advertisements.
            This information is processed and shared by Google in accordance with their Privacy Policy. We do not
            receive or process this specific user information from YouTube API Services ourselves, nor do we share it
            with internal or external parties.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            **Third-Party Content and Advertisements:**
            <br />
            Please be aware that our video features, powered by YouTube, may allow third parties to serve content,
            including advertisements, directly within the video player. These third parties may also store, access, or
            collect information (or allow others to do so) directly or indirectly on or from your devices, including
            through cookies or similar technologies.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            **Revoking Data Access (for Authorized Data Users):**
            <br />
            *Note: Our current implementation does not use "Authorized Data" (data requiring user login/OAuth) from
            YouTube. However, if you have previously granted any third-party applications access to your Google account
            data, you can revoke that access via the Google security settings page at{" "}
            <a
              href="https://security.google.com/settings/security/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B22234] hover:underline"
            >
              https://security.google.com/settings/security/permissions
            </a>
            .*
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            **Contact for Privacy Concerns:**
            <br />
            If you have any questions or complaints about our privacy practices related to the YouTube API Services,
            please contact us by visiting our{" "}
            <a href="/contact" className="text-[#B22234] hover:underline font-semibold">
              Contact Page
            </a>
            .
          </p>

          {/* RENAMED SECTIONS */}
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">
            14. Do United States Residents Have Specific Privacy Rights?
          </h2>
          <p className="text-gray-600 mb-4 text-lg">
            Residents of certain US states may have rights to access, correct, delete, or opt out of targeted
            advertising or profiling. Contact us to exercise these rights.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">15. Do Other Regions Have Specific Privacy Rights?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Residents of Australia and New Zealand have rights under their Privacy Acts to access or correct personal
            information. Contact us to exercise these rights.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">16. Do We Make Updates to This Notice?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We may update this Privacy Notice. Changes will be posted here, with material changes notified prominently.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">17. How Can You Contact Us About This Notice?</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Email us at{" "}
            <a href="/contact" className="text-[#B22234] hover:underline font-semibold">
              Contact Page
            </a>{" "}
            or contact us by post at:
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            RWT News LLC
            <br />
            1209 Mountain Rd Pl. NE
            <br />
            STE N
            <br />
            Albuquerque, NM 87110
            <br />
            United States
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">
            18. How Can You Review, Update, or Delete the Data We Collect?
          </h2>
          <p className="text-gray-600 mb-4 text-lg">
            To review, update, or delete your personal information, submit a data subject access request or contact us
            by visiting our{" "}
            <a href="/contact" className="text-[#B22234] hover:underline font-semibold">
              Contact Page
            </a>
            . We will respond to Data requests within 30 days.
          </p>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
