export default function Reviews() {
  return (
    <>
      <div className="px-[10%]">
        <div className="card card-compact bg-primary shadow-xl rounded-b-none">
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title text-base-300">Reviews</h2>

              <div className="card-actions justify-end">
                <button className="btn bg-base-300 border-none hover:bg-base-100 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <p className="hidden md:block">ADD A REVIEW</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[10%]">
        <div className="card card-compact bg-300 shadow-xl rounded-b-none">
          <div className="card-body">
            <div className="flex justify-center">
              <div className="rating gap-1  ">
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-red-400"
                />
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-yellow-400"
                />
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-lime-400"
                />
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-green-400"
                  checked
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[10%] mt-5 mb-5 grid grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="avatar justify-center mt-5">
            <div className="w-24 rounded-full">
              <img src="image/cx1.jpg" />
            </div>
          </div>

          <div className="card-body items-center">
            <h2 className="card-title text-center">Angelica D.</h2>

            <div className="rating gap-1 justify-center">
              <input
                type="radio"
                name="rating-1"
                className="mask mask-heart bg-red-400"
              />
              <input
                type="radio"
                name="rating-1"
                className="mask mask-heart bg-orange-400"
              />
              <input
                type="radio"
                name="rating-1"
                className="mask mask-heart bg-yellow-400"
              />
              <input
                type="radio"
                name="rating-1"
                className="mask mask-heart bg-lime-400"
              />
              <input
                type="radio"
                name="rating-1"
                className="mask mask-heart bg-green-400"
                checked
              />
            </div>
          </div>

          <div className="card-body items-center text-center">
            <p>Amazing services! My &#128054; is satisfied.</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="avatar justify-center mt-5">
            <div className="w-24 rounded-full">
              <img src="image/cx2.jpg" />
            </div>
          </div>

          <div className="card-body items-center">
            <h2 className="card-title text-center">Ella C.</h2>

            <div className="rating gap-1 justify-center">
              <input
                type="radio"
                name="rating-2"
                className="mask mask-heart bg-red-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-heart bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-heart bg-yellow-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-heart bg-lime-400"
                checked
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-heart bg-green-400"
              />
            </div>
          </div>

          <div className="card-body items-center text-center">
            <p>The doctor is so good! My baby cat is so happy. &#128049;</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="avatar justify-center mt-5">
            <div className="w-24 rounded-full">
              <img src="image/cx3.jpg" />
            </div>
          </div>

          <div className="card-body items-center">
            <h2 className="card-title text-center">Christian R.</h2>

            <div className="rating gap-1 justify-center">
              <input
                type="radio"
                name="rating-3"
                className="mask mask-heart bg-red-400"
              />
              <input
                type="radio"
                name="rating-3"
                className="mask mask-heart bg-orange-400"
              />
              <input
                type="radio"
                name="rating-3"
                className="mask mask-heart bg-yellow-400"
              />
              <input
                type="radio"
                name="rating-3"
                className="mask mask-heart bg-lime-400"
              />
              <input
                type="radio"
                name="rating-3"
                className="mask mask-heart bg-green-400"
                checked
              />
            </div>
          </div>

          <div className="card-body items-center text-center">
            <p>
              I recommend this vet clinic. My pet appointment went smoothly.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="avatar justify-center mt-5">
            <div className="w-24 rounded-full">
              <img src="image/cx4.jpg" />
            </div>
          </div>

          <div className="card-body items-center">
            <h2 className="card-title text-center">Tristan A.</h2>

            <div className="rating gap-1 justify-center">
              <input
                type="radio"
                name="rating-4"
                className="mask mask-heart bg-red-400"
              />
              <input
                type="radio"
                name="rating-4"
                className="mask mask-heart bg-orange-400"
              />
              <input
                type="radio"
                name="rating-4"
                className="mask mask-heart bg-yellow-400"
              />
              <input
                type="radio"
                name="rating-4"
                className="mask mask-heart bg-lime-400"
                checked
              />
              <input
                type="radio"
                name="rating-4"
                className="mask mask-heart bg-green-400"
              />
            </div>
          </div>

          <div className="card-body items-center text-center">
            <p>Great accomodation!</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="avatar justify-center mt-5">
            <div className="w-24 rounded-full">
              <img src="image/cx5.jpg" />
            </div>
          </div>

          <div className="card-body items-center">
            <h2 className="card-title text-center">Tala Nicole V.</h2>

            <div className="rating gap-1 justify-center">
              <input
                type="radio"
                name="rating-5"
                className="mask mask-heart bg-red-400"
              />
              <input
                type="radio"
                name="rating-5"
                className="mask mask-heart bg-orange-400"
              />
              <input
                type="radio"
                name="rating-5"
                className="mask mask-heart bg-yellow-400"
              />
              <input
                type="radio"
                name="rating-5"
                className="mask mask-heart bg-lime-400"
              />
              <input
                type="radio"
                name="rating-5"
                className="mask mask-heart bg-green-400"
                checked
              />
            </div>
          </div>
          <div className="card-body items-center text-center">
            <p>
              This vet clinic is worth it. Will come here again next time!
              &#128512;{" "}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="avatar justify-center mt-5">
            <div className="w-24 rounded-full">
              <img src="image/cx6.jpg" />
            </div>
          </div>

          <div className="card-body items-center">
            <h2 className="card-title text-center">Nathaniel A.</h2>

            <div className="rating gap-1 justify-center">
              <input
                type="radio"
                name="rating-6"
                className="mask mask-heart bg-red-400"
              />
              <input
                type="radio"
                name="rating-6"
                className="mask mask-heart bg-orange-400"
              />
              <input
                type="radio"
                name="rating-6"
                className="mask mask-heart bg-yellow-400"
              />
              <input
                type="radio"
                name="rating-6"
                className="mask mask-heart bg-lime-400"
              />
              <input
                type="radio"
                name="rating-6"
                className="mask mask-heart bg-green-400"
                checked
              />
            </div>
          </div>

          <div className="card-body items-center text-center">
            <p>
              {" "}
              The online appointment is so convenient. Didn&apos;t wait in long
              queue.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
