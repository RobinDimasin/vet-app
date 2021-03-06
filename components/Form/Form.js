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
        // className={className ?? "card w-[32rem] bg-base-100 shadow-xl"}
        className={className}
        onSubmit={formik.handleSubmit}
      >
        <div className="card-body">
          {title ? <h2 className="card-title">{title}</h2> : null}
          {children}
          {error ? (
            <div className="alert alert-error shadow-lg">
              <span>{error}</span>
            </div>
          ) : null}
          {submitButton}
          {footer ? <div className="divider"></div> : null}
          {footer}
        </div>
      </form>
    </FormProvider>
  );
}
