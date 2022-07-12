import Footer from "@components/Footer/Footer";
import NavigationBar from "@components/NavigationBar/NavigationBar";
import Link from "next/link";

const Rating = () => {
  return (
    <div className="rating mx-auto">
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
      />
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
        checked
      />
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
      />
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
      />
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
      />
    </div>
  );
};

export default function Home() {
  return (
    <>
      <div className="hero h-auto pt-12">
        <div className="hero-content md:px-[5%]">
          <div className="text-center lg:text-start">
            <h1 className="text-5xl font-bold">Vetreatment: Pet Clinic</h1>
            <p className="py-6">
              <b>Vetreatment</b> is a veterinary clinic that provides check-ups,
              treatments, diagnoses, vaccinations, deworming, general health
              care, and animal observation.
            </p>
            <Link href={"/appointments"}>
              <button className="btn btn-primary">
                Make An Appointment Now!
              </button>
            </Link>
          </div>
          <img
            src="/image/dog3.png"
            className="max-w-sm rounded-lg shadow-2xl h-[400px]"
          />
        </div>
      </div>

      {/* <div className="hero min-h-screen bg-base-200">
        <div className="card w-[80%] glass -top-[200px]">
          <div className="card-body">
            <h2 className="card-title">Appointment</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse pulvinar tortor eu turpis tempor, vel condimentum urna
              egestas.
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div> */}
      {/* 
      <div className="from-accent to-primary bg-gradient-to-br">
        <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
          <div className="text-center lg:text-start">
            <h1 className="text-5xl font-bold">Reviews</h1>
            <p className="py-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              risus nulla, pellentesque vitae purus ac, rhoncus sodales odio. In
              hac habitasse platea dictumst. Suspendisse at finibus orci.
            </p>
            <button className="btn btn-accent">Make An Appointment Now!</button>
          </div>
        </div>
      </div> */}

      {/* <div className="hero from-primary to-accent text-primary-content min-h-screen bg-gradient-to-br">
        <div className="hero-content mx-auto max-w-md text-center md:max-w-full">
          <div>
            <h2 className="mt-20 mb-2 text-4xl font-extrabold md:text-6xl mb-16">
              Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="card w-64 bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-start">
                    <b>Bill Gates:</b> Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                  <Rating />
                </div>
              </div>
              <div className="card w-64 bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-start">
                    <b>Bill Gates:</b> Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                  <Rating />
                </div>
              </div>
              <div className="card w-64 bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-start">
                    <b>Bill Gates:</b> Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                  <Rating />
                </div>
              </div>
              <div className="card w-64 bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-start">
                    <b>Bill Gates:</b> Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                  <Rating />
                </div>
              </div>
              <div className="card w-64 bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-start">
                    <b>Bill Gates:</b> Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                  <Rating />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
