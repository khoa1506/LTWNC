import React from "react";

const Contact = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <p>
        Liên hệ với chung tôi qua Email{" "}
        <a href="mailto:support@movieapp.com" className="text-blue-500">
          khoa.2274802010743@vanlanguni.vn
          tai.2274802010768@vanlanguni.vn
        </a>
        .
      </p>
    </div>
  );
};

export default Contact;