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
    <div class="hero min-h-screen" style={{ backgroundImage: `url("https://cdn.discordapp.com/attachments/880911305471586354/996796654604791808/ezgif.com-gif-maker_2.gif")` }}>
  <div class="hero-overlay bg-opacity-60"></div>
  <div class="hero-content text-center text-neutral-content">
    <div class="max-w-md">
      <h1 class="mb-4 text-6xl font-bold drop-shadow-lg shadow-black">Welcome to Vetreatment!</h1>
      <h2 class="mb-2 text-3xl">Pet Clinic</h2>
      <p class="mb-5">Providing the best services for your pets.</p>
      <button class="btn btn-outline btn-primary">Book an appointment</button>
    </div>
  </div>
</div>
      <div className="hero h-auto py-12">
        <div className="hero-content md:px-[5%]">
          <div className="text-center lg:text-start">
            <h1 className="text-5xl text-[#2a7a9f] font-bold">ABOUT US</h1>
            <p className="py-6 pr-20 text-[#3b3b3b]">
              <b>Vetreatment</b> is a veterinary clinic that provides check-ups,
              treatments, <br /> diagnoses, vaccinations, deworming, general health
              care, and animal <br />observation. 
            </p>
            <Link href={"/appointments"}>
              <button class="h-10 px-5 text-white font-bold transition-colors duration-150 bg-[#2a7a9f] 
              rounded-full focus:shadow-outline hover:bg-[#236887] shadow-md">&nbsp;&nbsp;&nbsp;Contact us&nbsp;&nbsp;&nbsp;</button>
            </Link>
          </div>
          <img src="/image/dog3.png" className="max-w-sm rounded-lg shadow-2xl h-[400px]" />
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

      <div className="hero h-auto pb-7">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-5xl text-[#2a7a9f] font-bold pb-7">OUR SERVICES</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="card h-64 w-64 bg-base-100 shadow-md rounded-xl mr-7 mb-7 border border-[#d9d9d9]">
                  <figure class="px-10 pt-10">
                    <img src="/image/1.png" alt="Check-up" />
                  </figure>
                    <div class="card-body items-center text-center">
                      <h2 class="card-title text-[#2a7a9f] font-bold">Check-up</h2>
                    </div>
                </div>
                
                <div class="card h-64 w-64 bg-base-100 shadow-2xl rounded-xl mr-7 mb-7">
                  <figure class="px-10 pt-10">
                    <img src="/image/2.png" alt="Vaccination" />
                  </figure>
                    <div class="card-body items-center text-center">
                      <h2 class="card-title text-[#2a7a9f] font-bold">Vaccination</h2>
                    </div>
                </div>

                <div class="card h-64 w-644 bg-base-100 shadow-md rounded-xl mr-7 mb-7 border border-[#d9d9d9]">
                  <figure class="px-10 pt-10">
                    <img src="/image/3.png" alt="Deworming" />
                  </figure>
                    <div class="card-body items-center text-center">
                      <h2 class="card-title text-[#2a7a9f] font-bold">Deworming</h2>
                    </div>
                </div>

                <div class="card h-64 w-64 bg-base-100 shadow-2xl rounded-xl">
                  <figure class="px-10 pt-10">
                    <img src="/image/4.png" alt="Consultations" />
                  </figure>
                    <div class="card-body items-center text-center">
                      <h2 class="card-title text-[#2a7a9f] font-bold">Consultations</h2>
                    </div>
                </div>

                <div class="card h-64 w-64 bg-base-100 shadow-md rounded-xl border border-[#d9d9d9]">
                  <figure class="px-10 pt-10">
                    <img src="/image/5.png" alt="General Health Care" />
                  </figure>
                    <div class="card-body items-center text-center">
                      <h2 class="card-title text-[#2a7a9f] font-bold">General Health Care</h2>
                    </div>
                </div>

                    <div class="card h-64 w-64 bg-base-100 shadow-2xl rounded-xl">
                  <figure class="px-10 pt-10">
                    <img src="/image/6.png" alt="Diagnoses" />
                  </figure>
                    <div class="card-body items-center text-center">
                      <h2 class="card-title text-[#2a7a9f] font-bold">Diagnoses</h2>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hero h-50 py-20" style={{ backgroundImage: `url("https://www.houstonansweringservices.com/site/wp-content/uploads/2018/08/veterinarian.jpg")` }}>
        <div class="hero-overlay bg-[#2a7a9f] opacity-60"></div>
        <div class="hero-content flex-col lg:flex-row-reverse">
        <img src="https://aurismedical.com/templates/yootheme/cache/spacer-7a3d6174.png" class="max-w-sm rounded-lg" />
    <div>
      <h1 class="text-5xl text-white font-bold">Join us!</h1>
      <p class="py-3 text-white">We believe in nurturing the human-animal bond and creating a harmonious relationship 
      <br />between people and animals and we appreciate the role we get to play in your pets’ health 
      <br />care. Register to become a part of our family!</p>
                  <Link href={"/register"}>
              <button class="h-10 px-5 text-white font-bold transition-colors duration-150 bg-[#2a7a9f] 
              rounded-full focus:shadow-outline hover:bg-[#236887] shadow-md">&nbsp;&nbsp;&nbsp;Register&nbsp;&nbsp;&nbsp;</button>
            </Link>
    </div>
  </div>
      </div>

      <footer class="footer p-10 bg-neutral text-neutral-content">
      <div>
        <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" class="fill-current"><path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path></svg>
        <p>Vetreatment: Pet Clinic<br />Providing the best services for your pets.</p>
      </div> 
      <div>
        <span class="footer-title">Social</span> 
        <div class="grid grid-flow-col gap-4">
          <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a> 
          <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a> 
          <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
      </div>
    </div>
  </footer>
    </>
  );
}
