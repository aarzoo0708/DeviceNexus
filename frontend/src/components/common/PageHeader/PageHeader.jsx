import "./PageHeader.css";

function PageHeader({ title, description, action }) {
  return (
    <div className="page-header">

      <div className="page-header-content">
        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {action && (
        <div className="page-header-action">
          {action}
        </div>
      )}

    </div>
  );
}

export default PageHeader;