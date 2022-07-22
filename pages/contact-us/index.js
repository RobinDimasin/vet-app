export default function ContactUs() {
  return (
    <>
      <div className="px-[10%] space-y-4">
        <div className="card card-compact bg-primary shadow-xl rounded-b-none">
          <div className="card-body">
            <div className="flex justify-center">
              <h2 className="card-title text-base-300">
                HAVE A QUESTION? LET US KNOW!
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[10%] space-y-4 mt-5">
        <div className="card lg:card-side shadow-xl bg-gradient-to-r from-cyan-500 to-blue-500">
          <figure>
            <img
              src="image/dogvet.jpg"
              className="max-w-sm mx-5 mt-5 mb-5 rounded-lg shadow-2xl h-[400px]"
              alt="dog"
            ></img>
          </figure>
          <div className="card-body">
            <h2 className="card-title text-base-300 justify-center tracking-widest text-2xl font-bold">
              CONTACT US!
            </h2>
            <p className="text-center text-base-300">
              +63 966 307 6593 | vetreatment@gmail.com
            </p>
            <div className="flex space-x-14">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-300">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary input-md w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-300">
                    Email Address
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary input-md w-full"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-300">Message</span>
              </label>
              <textarea
                className="textarea textarea-primary textarea-bordered h-24"
                placeholder="Message"
              ></textarea>
            </div>

            <p></p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">SUBMIT</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
