import Form from "./components/Form";
import bg from "./assets/waves-bg-lime-half.png";

const Page = () => {
  return (
    <div>
      <section className="py-12 lg:py-24 relative overflow-hidden">
        <img
          className="fixed top-0 left-0 w-full h-screen"
          src={bg}
          alt="Waves"
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-20">
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl tracking-sm mb-6">
                Risk Calculator
              </h1>
              <p className="text-lg text-gray-700 mb-16">
                We are here to help you calculate your risk!
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-md">
              <div>
                <Form />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
