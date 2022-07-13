export default function ContactUs() {
  return (
    <>  
      <div className="px-[10%] space-y-4">
        <div class="card card-compact bg-primary shadow-xl rounded-b-none">
          <div class="card-body">
            <div class="flex justify-center">
              <h2 class="card-title text-base-300">CONTACT US!</h2>
              </div>
            </div>
          </div>
        </div>


        <div className="px-[10%] space-y-4 mt-5">
        <div class="card lg:card-side shadow-xl bg-gradient-to-r from-cyan-500 to-blue-500">
          <figure><img src="image/dogvet.jpg" class="max-w-sm mx-5 mt-5 mb-5 rounded-lg shadow-2xl h-[400px]" alt="dog"></img></figure>
          <div class="card-body">

            <h2 class="card-title text-base-300 justify-center">HAVE A QUESTION? LET US KNOW!</h2>
            
            <div class="flex space-x-14">
            <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text text-base-300">Name</span>
                </label>
                <input type="text" placeholder="Type here" class="input input-bordered input-primary input-md w-full max-w-xs" />
              </div>

            <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text text-base-300">Email Address</span>
                </label>
                <input type="text" placeholder="Type here" class="input input-bordered input-primary input-md w-full max-w-xs" />
              </div>
            </div>

              <div class="form-control">
              <label class="label">
                <span class="label-text text-base-300">Message</span>
              </label> 
              <textarea class="textarea textarea-primary textarea-bordered h-24" placeholder="Bio"></textarea>
            </div>

            <p></p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">SUBMIT</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
