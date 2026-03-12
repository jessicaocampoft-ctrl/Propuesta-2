const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Cargar el HTML local
    const htmlPath = path.resolve(__dirname, 'propuesta_empresarial.html');
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Ocultar el botón de descarga (clase no-print)
    await page.evaluate(() => {
        document.querySelectorAll('.no-print').forEach(el => el.style.display = 'none');
    });

    // Esperar a que las fuentes de Google se carguen
    await page.evaluateHandle('document.fonts.ready');

    // Generar el PDF
    const pdfPath = path.resolve(__dirname, 'Propuesta_Alineacion_1_5cm.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '1.5cm',
            bottom: '1.5cm',
            left: '1.5cm',
            right: '1.5cm'
        }
    });

    console.log('✅ PDF generado exitosamente en: ' + pdfPath);
    await browser.close();
})();
