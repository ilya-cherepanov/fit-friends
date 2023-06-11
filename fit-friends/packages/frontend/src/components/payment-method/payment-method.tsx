import {OrderPaymentMethod} from '@fit-friends/core';


interface PaymentMethodProps {
  value: OrderPaymentMethod | null,
  onChange: (value: OrderPaymentMethod) => void;
}

export function PaymentMethod({value, onChange}: PaymentMethodProps) {
  return (
    <section className="payment-method">
      <h4 className="payment-method__title">Выберите способ оплаты</h4>
      <ul className="payment-method__list">
        <li className="payment-method__item">
          <div className="btn-radio-image">
            <label>
              <input type="radio" name="payment-purchases" aria-label="Visa." checked={value === OrderPaymentMethod.Visa} onChange={() => onChange(OrderPaymentMethod.Visa)}/><span
              className="btn-radio-image__image">
                    <svg width="58" height="20" aria-hidden="true">
                      <use xlinkHref="#visa-logo"></use>
                    </svg></span>
            </label>
          </div>
        </li>
        <li className="payment-method__item">
          <div className="btn-radio-image">
            <label>
              <input type="radio" name="payment-purchases" aria-label="Мир." checked={value === OrderPaymentMethod.Mir} onChange={() => onChange(OrderPaymentMethod.Mir)}/><span
              className="btn-radio-image__image">
                    <svg width="66" height="20" aria-hidden="true">
                      <use xlinkHref="#mir-logo"></use>
                    </svg></span>
            </label>
          </div>
        </li>
        <li className="payment-method__item">
          <div className="btn-radio-image">
            <label>
              <input type="radio" name="payment-purchases" aria-label="Iomoney." checked={value === OrderPaymentMethod.Umoney} onChange={() => onChange(OrderPaymentMethod.Umoney)}/><span
              className="btn-radio-image__image">
                    <svg width="106" height="24" aria-hidden="true">
                      <use xlinkHref="#iomoney-logo"></use>
                    </svg></span>
            </label>
          </div>
        </li>
      </ul>
    </section>
  );
}
