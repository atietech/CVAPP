import React from 'react';
import { Page, Text, Document, StyleSheet } from '@react-pdf/renderer';

// Styles minimaux
const styles = StyleSheet.create({
    page: {
        fontSize: 12,
        padding: 40,
    },
    text: {
        marginBottom: 10,
    }
});

export const TestPdfDocument = () => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.text}>Test PDF Document</Text>
                <Text style={styles.text}>Ceci est un test minimal.</Text>
                <Text style={styles.text}>Si ce document se génère, alors @react-pdf/renderer fonctionne correctement.</Text>
            </Page>
        </Document>
    );
};
