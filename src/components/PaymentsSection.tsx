import { Payments } from './Payments';

export default function PaymentsSection() {
  const handleViewPayment = (paymentId: number) => {
    console.log('Viewing payment:', paymentId);
  };

  return <Payments onViewPayment={handleViewPayment} />;
}