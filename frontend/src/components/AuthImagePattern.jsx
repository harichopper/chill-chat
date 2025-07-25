const AuthImagePattern = ({
  title = "Welcome Back!",
  subtitle = "Connect with your friends easily and securely",
  patternCount = 9,
  animate = true,
  icon = null,
}) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 dark:bg-neutral p-12">
      <div className="max-w-md text-center">
        {/* Optional Icon */}
        {icon && (
          <img src={icon} alt="auth pattern icon" className="mx-auto mb-4 w-16" />
        )}

        {/* Pattern Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(patternCount)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                animate && i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60 dark:text-base-content/80">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
