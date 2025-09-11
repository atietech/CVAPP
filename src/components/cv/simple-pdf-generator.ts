// Solution de génération PDF ultra-simple sans dépendances externes
export const generateSimplePdf = (personalInfo: { name: string; title: string; email: string; phone: string; location: string }) => {
  // Créer le contenu HTML du CV
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CV - ${personalInfo.name}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
        }
        .name { 
          font-size: 28px; 
          font-weight: bold; 
          color: #2563eb;
          margin-bottom: 8px;
        }
        .title { 
          font-size: 16px; 
          color: #666;
          margin-bottom: 15px;
        }
        .contact {
          font-size: 14px;
          color: #555;
        }
        .contact span {
          margin: 0 10px;
        }
        .section {
          margin: 25px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${personalInfo.name}</div>
        <div class="title">${personalInfo.title}</div>
        <div class="contact">
          <span>📧 ${personalInfo.email}</span>
          <span>📱 ${personalInfo.phone}</span>
          <span>📍 ${personalInfo.location}</span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Informations</div>
        <p>Ce CV a été généré avec succès. Version de débogage utilisée pour résoudre les problèmes de génération PDF.</p>
        <p>Toutes les fonctionnalités seront progressivement ajoutées une fois que la génération PDF de base fonctionnera.</p>
      </div>
    </body>
    </html>
  `;

  // Ouvrir dans une nouvelle fenêtre pour impression
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Attendre que le contenu se charge puis déclencher l'impression
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  } else {
    // Fallback: créer un blob et le télécharger
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${personalInfo.name.replace(/ /g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
