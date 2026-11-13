# CampusArge - Hostinger Deployment & Email Setup Guide

इस गाइड में आपकी वेबसाइट को Hostinger पर लाइव करने और Contact Form Emails को configure करने के सभी steps दिए गए हैं।

---

## 1. Emails & SMTP Configuration (Hostinger Webmail)

आपकी दोनों Hostinger business emails को वेबसाइट के Contact Form और Backend से connect कर दिया गया है:

| Email ID | Password | Role |
| :--- | :--- | :--- |
| **`query@campusarge.com`** | `Yashvardhan@_2027` | Primary SMTP Sender & Recipient |
| **`info@campusarge.com`** | `Akshay_@2027` | General Inquiries & Fallback Recipient |

### कैसे काम करता है:
1. जब भी कोई visitor वेबसाइट के `/contact` पेज पर फॉर्म भरेगा, तो `api/contact.php` Hostinger के secure SSL SMTP server (`ssl://smtp.hostinger.com:465`) से authentic mail send करेगा।
2. Email सीधे आपके **`query@campusarge.com`** और **`info@campusarge.com`** दोनों inboxes में deliver होगी।
3. आप Hostinger Webmail (`https://mail.hostinger.com`) में जाकर सिर्फ **"Reply"** दबाकर सीधे user को जवाब दे सकते हैं (Reply-To auto set है)।
4. सभी submissions का backup `api/logs/contacts.log` में भी सुरक्षित सेव होता है।

---

## 2. Social Media Handles Connected

Website के footer में official social media handles live कर दिए गए हैं:

- **LinkedIn:** [https://www.linkedin.com/company/144138973/](https://www.linkedin.com/company/144138973/)
- **Instagram:** [https://www.instagram.com/campusarge/](https://www.instagram.com/campusarge/)
- **Twitter / X:** [https://x.com/campusarge](https://x.com/campusarge)
- **YouTube:** [https://www.youtube.com/@campusarge](https://www.youtube.com/@campusarge)

*नोट: सभी links `target="_blank" rel="noopener noreferrer"` के साथ नए tab में सुरक्षित खुलते हैं।*

---

## 3. SEO Enhancements (Modern 2026 Standards)

- **JSON-LD Schema.org Structured Data**: Google Search के लिए `EducationalOrganization` और Sitelinks SearchBox `WebSite` schema जोड़ा गया है।
- **Canonical Tags**: Duplicate content penalty से बचने के लिए canonical URL tags set हैं।
- **OpenGraph & Twitter Cards**: WhatsApp, LinkedIn, Twitter, Facebook पर link share करने पर CampusArge का rich preview card दिखेगा।
- **Dynamic XML Sitemap (`sitemap.xml`)**: सभी 426 institutions और active pages के साथ auto-generate किया गया है।
- **Search Engine Directives (`robots.txt`)**: Crawlers को सही path allow/disallow करने के लिए configured है।
- **Pre-rendering**: सभी 426 institution pages pre-rendered HTML के साथ compile हुए हैं, जिससे Google Bot instant index कर सकता है।

---

## 4. Hostinger पर Deploy करने के Steps (5 Minutes)

तैयार Deployable ZIP फ़ाइल आपके प्रोजेक्ट के root में मौजूद है:
**`D:\CampusArge\campusarge_hostinger_deploy.zip`**

### Step-by-Step Deployment:
1. **Hostinger hPanel में Login करें**:
   - [https://hpanel.hostinger.com](https://hpanel.hostinger.com) पर जाएं।
2. **File Manager खोलें**:
   - अपने domain `campusarge.com` के dashboard में जाएं और **File Manager** पर click करें।
   - **`public_html`** फोल्डर के अंदर जाएं।
3. **Purani Files Clean करें (यदि पहले से कुछ खाली डिफ़ॉल्ट फ़ाइलें हैं)**:
   - `default.php` या कोई पुरानी फ़ाइल हो तो उसे delete कर लें।
4. **ZIP Upload करें**:
   - File Manager में ऊपर **Upload** icon पर click करें और `campusarge_hostinger_deploy.zip` को select करें।
5. **Extract करें**:
   - Upload होने के बाद `campusarge_hostinger_deploy.zip` पर right-click करें और **Extract** चुनें।
   - Destination में **`public_html`** रहने दें और Extract पर click करें।
   - Extract होने के बाद आप zip file को delete कर सकते हैं।
6. **Done!**:
   - आपकी वेबसाइट तुरंत `https://campusarge.com` पर live हो जाएगी।
   - Subpages (`/institutions`, `/compare`, `/about`, `/contact`) के लिए `.htaccess` auto-configured है, जिससे कोई 404 error नहीं आएगा।

