import FormProvider from "./FormProvider";

export default function Form({
  className,
  formik,
  title,
  children,
  error,
  submitButton,
  footer,
}) {
  return (
    <FormProvider formik={formik}>
      <form
        className={className ?? "card w-[32rem] bg-base-100 shadow-xl"}
        onSubmit={formik.handleSubmit}
      >
        <div className="card-body space-y-1">
          {title ? <h2 className="card-title">{title}</h2> : null}
          {children}
          {error ? (
            <div className="alert alert-error shadow-lg">
              <span>{error}</span>
            </div>
          ) : null}
          {submitButton}
          <div className="divider"></div>
          {footer}
        </div>
      </form>
    </FormProvider>
  );
}
