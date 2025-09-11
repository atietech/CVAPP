import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Styles simples
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        padding: 40,
        color: '#2d3748',
        backgroundColor: '#ffffff',
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        color: '#2563eb',
        marginBottom: 10,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#dbeafe',
        paddingBottom: 2,
    },
    text: {
        marginBottom: 3,
    },
});

type SimplePersonalInfo = {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
};

type SimplePdfData = {
    personalInfo: SimplePersonalInfo;
};

type SimplePdfDocumentProps = {
    data: SimplePdfData;
};

export const SimpleCvPdfDocument = ({ data }: SimplePdfDocumentProps) => {
    const { personalInfo } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>{personalInfo.name}</Text>
                    <Text style={styles.title}>{personalInfo.title}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>
                    <Text style={styles.text}>{personalInfo.email}</Text>
                    <Text style={styles.text}>{personalInfo.phone}</Text>
                    <Text style={styles.text}>{personalInfo.location}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Information</Text>
                    <Text style={styles.text}>Ce document PDF a été généré avec succès.</Text>
                    <Text style={styles.text}>Les fonctionnalités complètes seront ajoutées progressivement.</Text>
                </View>
            </Page>
        </Document>
    );
};
