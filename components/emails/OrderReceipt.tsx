import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Row,
    Column,
    Hr,
} from '@react-email/components';

interface OrderReceiptProps {
    customerName: string;
    orderId: string;
    pickupTimeFormatted: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    totals: {
        subtotal: number;
        total: number;
        tax?: number;
    };
}

export const OrderReceipt = ({
    customerName,
    orderId,
    pickupTimeFormatted,
    items,
    totals,
}: OrderReceiptProps) => {
    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Lato:wght@300;400;700&family=Lobster&family=Montserrat:wght@600;700&display=swap');
                `}</style>
            </Head>
            <Preview>Bedankt voor je bestelling bij Wake &apos;n Bake!</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                tomato: '#CE2029',
                                crust: '#D4A056',
                                espresso: '#2C2C2C',
                                flour: '#F9F7F2',
                                pistachio: '#93C572',
                            },
                        },
                    },
                }}
            >
                <Body style={{ backgroundColor: '#F9F7F2', fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif", margin: 0, padding: 0 }}>
                    <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>

                        {/* Dark Header */}
                        <Section style={{
                            backgroundColor: '#2C2C2C',
                            borderRadius: '24px 24px 0 0',
                            padding: '40px 40px 20px',
                            textAlign: 'center' as const,
                        }}>
                            <Heading style={{
                                fontFamily: "'Lobster', cursive",
                                color: '#F9F7F2',
                                fontSize: '36px',
                                fontWeight: 400,
                                margin: 0,
                                textShadow: '2px 2px 0px #8B1E25, 4px 4px 0px rgba(44,44,44,0.5)',
                            }}>
                                Wake &apos;n Bake
                            </Heading>
                            <Text style={{
                                fontFamily: "'Oswald', sans-serif",
                                color: '#CE2029',
                                fontSize: '11px',
                                letterSpacing: '3px',
                                textTransform: 'uppercase' as const,
                                fontWeight: 600,
                                margin: '4px 0 0',
                            }}>
                                Italian Panificio
                            </Text>
                        </Section>

                        {/* Gold divider */}
                        <Section style={{ backgroundColor: '#2C2C2C', padding: '0 50px' }}>
                            <div style={{ height: '1px', backgroundColor: '#D4A056', opacity: 0.4 }} />
                        </Section>

                        {/* Greeting in dark section */}
                        <Section style={{
                            backgroundColor: '#2C2C2C',
                            padding: '20px 40px 35px',
                            textAlign: 'center' as const,
                        }}>
                            <Text style={{
                                fontFamily: "'Lato', sans-serif",
                                color: '#F9F7F2',
                                fontSize: '18px',
                                fontWeight: 300,
                                margin: 0,
                            }}>
                                Ciao {customerName}!
                            </Text>
                            <Text style={{
                                fontFamily: "'Lato', sans-serif",
                                color: '#999',
                                fontSize: '14px',
                                fontWeight: 300,
                                margin: '8px 0 0',
                            }}>
                                Bedankt voor je bestelling! We gaan direct aan de slag.
                            </Text>
                        </Section>

                        {/* Main white content area */}
                        <Section style={{
                            backgroundColor: '#ffffff',
                            padding: '0',
                        }}>

                            {/* Pickup Time Card */}
                            <Section style={{
                                backgroundColor: '#F9F7F2',
                                margin: '30px 30px 25px',
                                borderRadius: '12px',
                                border: '2px solid #D4A056',
                                textAlign: 'center' as const,
                                padding: '25px',
                            }}>
                                <Text style={{
                                    fontFamily: "'Oswald', sans-serif",
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase' as const,
                                    color: '#D4A056',
                                    letterSpacing: '3px',
                                    margin: '0 0 8px',
                                }}>
                                    Je Ophaaltijd
                                </Text>
                                <Heading style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontSize: '20px',
                                    color: '#2C2C2C',
                                    fontWeight: 700,
                                    margin: 0,
                                    textTransform: 'uppercase' as const,
                                }}>
                                    {pickupTimeFormatted}
                                </Heading>
                                <Text style={{
                                    fontFamily: "'Oswald', sans-serif",
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#CE2029',
                                    backgroundColor: '#fef2f2',
                                    display: 'inline-block',
                                    padding: '4px 14px',
                                    borderRadius: '20px',
                                    margin: '12px 0 0',
                                    letterSpacing: '1px',
                                }}>
                                    Order #{orderId}
                                </Text>
                            </Section>

                            {/* Order Items */}
                            <Section style={{ padding: '0 30px 20px' }}>
                                <Text style={{
                                    fontFamily: "'Oswald', sans-serif",
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase' as const,
                                    color: '#D4A056',
                                    letterSpacing: '3px',
                                    borderBottom: '1px solid #E8E4DC',
                                    paddingBottom: '8px',
                                    margin: '0 0 16px',
                                }}>
                                    Bestelling
                                </Text>

                                {items.map((item, idx) => (
                                    <Row key={idx} style={{ marginBottom: '10px' }}>
                                        <Column style={{ width: '40px' }}>
                                            <Text style={{
                                                margin: 0,
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontWeight: 700,
                                                color: '#CE2029',
                                                fontSize: '14px',
                                            }}>
                                                {item.quantity}x
                                            </Text>
                                        </Column>
                                        <Column>
                                            <Text style={{
                                                margin: 0,
                                                fontFamily: "'Lato', sans-serif",
                                                fontWeight: 400,
                                                color: '#2C2C2C',
                                                fontSize: '14px',
                                            }}>
                                                {item.name}
                                            </Text>
                                        </Column>
                                        <Column style={{ textAlign: 'right' as const }}>
                                            <Text style={{
                                                margin: 0,
                                                fontFamily: "'Lato', sans-serif",
                                                color: '#666',
                                                fontSize: '14px',
                                            }}>
                                                &euro;{(item.price * item.quantity).toFixed(2)}
                                            </Text>
                                        </Column>
                                    </Row>
                                ))}
                            </Section>

                            {/* Gold divider */}
                            <Section style={{ padding: '0 30px' }}>
                                <div style={{ height: '2px', backgroundColor: '#D4A056', opacity: 0.3, borderRadius: '1px' }} />
                            </Section>

                            {/* Totals */}
                            <Section style={{ padding: '16px 30px', textAlign: 'right' as const }}>
                                <Row>
                                    <Column>
                                        <Text style={{
                                            margin: 0,
                                            fontFamily: "'Oswald', sans-serif",
                                            fontWeight: 700,
                                            fontSize: '20px',
                                            color: '#2C2C2C',
                                            textTransform: 'uppercase' as const,
                                            letterSpacing: '1px',
                                        }}>
                                            Totaal
                                        </Text>
                                    </Column>
                                    <Column style={{ width: '100px' }}>
                                        <Text style={{
                                            margin: 0,
                                            fontFamily: "'Montserrat', sans-serif",
                                            fontWeight: 700,
                                            fontSize: '20px',
                                            color: '#CE2029',
                                        }}>
                                            &euro;{totals.total.toFixed(2)}
                                        </Text>
                                    </Column>
                                </Row>
                                <Row>
                                    <Column>
                                        <Text style={{
                                            margin: 0,
                                            fontFamily: "'Lato', sans-serif",
                                            color: '#aaa',
                                            fontSize: '11px',
                                        }}>
                                            Inclusief BTW
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>

                            {/* Spacer */}
                            <Section style={{ padding: '10px' }} />
                        </Section>

                        {/* Dark Footer */}
                        <Section style={{
                            backgroundColor: '#2C2C2C',
                            borderRadius: '0 0 24px 24px',
                            padding: '30px 40px',
                            textAlign: 'center' as const,
                        }}>
                            <Text style={{
                                fontFamily: "'Oswald', sans-serif",
                                fontWeight: 700,
                                color: '#D4A056',
                                textTransform: 'uppercase' as const,
                                letterSpacing: '2px',
                                fontSize: '13px',
                                margin: '0 0 4px',
                            }}>
                                Wake &apos;n Bake
                            </Text>
                            <Text style={{
                                fontFamily: "'Lato', sans-serif",
                                color: '#888',
                                fontSize: '13px',
                                margin: '0',
                                lineHeight: '20px',
                            }}>
                                Vijzelstraat 93H
                            </Text>
                            <Text style={{
                                fontFamily: "'Lato', sans-serif",
                                color: '#888',
                                fontSize: '13px',
                                margin: '0 0 16px',
                                lineHeight: '20px',
                            }}>
                                1017 HH Amsterdam
                            </Text>

                            <div style={{ height: '1px', backgroundColor: '#D4A056', opacity: 0.2, margin: '0 40px 16px' }} />

                            <Text style={{
                                fontFamily: "'Lato', sans-serif",
                                color: '#666',
                                fontSize: '11px',
                                margin: 0,
                                fontStyle: 'italic',
                            }}>
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
