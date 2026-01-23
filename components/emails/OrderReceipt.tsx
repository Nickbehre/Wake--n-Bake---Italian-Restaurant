import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Tailwind,
    Row,
    Column,
    Hr,
} from '@react-email/components';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface OrderReceiptProps {
    customerName: string;
    orderId: string;
    pickupTime: string; // ISO String
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    totals: {
        subtotal: number;
        total: number;
        tax: number;
    };
}

// Mock logo URL - replace with actual hosted URL
const logoUrl = "https://wake-n-bake.nl/logo.png";

export const OrderReceipt = ({
    customerName,
    orderId,
    pickupTime,
    items,
    totals,
}: OrderReceiptProps) => {
    const formattedDate = pickupTime
        ? format(new Date(pickupTime), "EEEE d MMMM 'om' HH:mm", { locale: nl })
        : "Datum onbekend";

    return (
        <Html>
            <Head />
            <Preview>Bedankt voor je bestelling bij Wake n Bake!</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: '#CE2029',
                                gold: '#D4A056',
                                offwhite: '#F9F7F2',
                                dark: '#2C2C2C',
                            },
                        },
                    },
                }}
            >
                <Body className="bg-offwhite font-sans text-dark">
                    <Container className="bg-white my-10 mx-auto p-5 rounded shadow-sm max-w-[600px] border border-gray-200">
                        {/* Header */}
                        <Section className="text-center pb-6 border-b border-gray-100">
                            <Heading className="text-2xl font-bold uppercase tracking-widest text-brand m-0">
                                Wake n Bake
                            </Heading>
                            <Text className="text-gray-500 uppercase text-xs tracking-widest mt-1">Italian Panificio</Text>
                        </Section>

                        {/* Hero */}
                        <Section className="py-6 text-center">
                            <Text className="text-lg">Ciao {customerName},</Text>
                            <Text className="text-gray-600">Bedankt voor je bestelling! We gaan direct aan de slag om alles vers te bakken.</Text>
                        </Section>

                        {/* Pickup Info */}
                        <Section className="bg-gray-50 p-6 rounded text-center mb-6">
                            <Text className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Je Ophaaltijd</Text>
                            <Heading className="text-2xl text-brand font-bold m-0 uppercase">
                                {formattedDate}
                            </Heading>
                            <Text className="text-sm font-bold text-dark mt-4 bg-gray-200 inline-block px-3 py-1 rounded">
                                Order # {orderId}
                            </Text>
                        </Section>

                        {/* Line Items */}
                        <Section className="mb-6">
                            <Text className="font-bold uppercase text-xs text-gray-400 tracking-widest mb-4 border-b pb-2">Bestelling</Text>
                            {items.map((item, idx) => (
                                <Row key={idx} className="mb-3">
                                    <Column className="w-12">
                                        <Text className="m-0 font-bold text-brand">{item.quantity}x</Text>
                                    </Column>
                                    <Column>
                                        <Text className="m-0 font-medium text-dark">{item.name}</Text>
                                    </Column>
                                    <Column className="text-right">
                                        <Text className="m-0 text-gray-600">€{(item.price * item.quantity).toFixed(2)}</Text>
                                    </Column>
                                </Row>
                            ))}
                        </Section>

                        <Hr className="border-gray-200 my-4" />

                        {/* Totals */}
                        <Section className="text-right">
                            <Row>
                                <Column><Text className="m-0 text-gray-500 text-sm">Subtotaal</Text></Column>
                                <Column className="w-24"><Text className="m-0 text-dark">€{totals.subtotal.toFixed(2)}</Text></Column>
                            </Row>
                            <Row>
                                <Column><Text className="m-0 text-gray-500 text-xs">BTW (9%)</Text></Column>
                                <Column className="w-24"><Text className="m-0 text-gray-500 text-xs">€{totals.tax.toFixed(2)}</Text></Column>
                            </Row>
                            <Row className="mt-2">
                                <Column><Text className="m-0 font-bold text-xl text-brand uppercase">Totaal</Text></Column>
                                <Column className="w-24"><Text className="m-0 font-bold text-xl text-dark">€{totals.total.toFixed(2)}</Text></Column>
                            </Row>
                        </Section>

                        <Hr className="border-gray-200 my-8" />

                        {/* Footer */}
                        <Section className="text-center text-gray-500 text-sm">
                            <Text className="font-bold text-dark uppercase tracking-widest mb-1">Wake n Bake</Text>
                            <Text className="m-0">Vijzelstraat 93H</Text>
                            <Text className="m-0 mb-4">1017 HH Amsterdam</Text>

                            <Text className="text-xs text-gray-400 mt-6">
                                Laat deze email zien aan onze medewerker.
                            </Text>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default OrderReceipt;
