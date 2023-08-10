"use client";
export default function EditProfile() {
  return (
    <>
      <main className="min-h-[calc(100vh-15.5rem)] flex flex-col items-center py-20">
        <form className="w-full flex justify-center">
          <table className="rounded-none table max-w-xl static">
            <tbody>
              <tr>
                <td className="col-span-2 flex justify-center">
                  <h1 className="font-secondary text-3xl lg:text-4xl mt-10 lg:mt-2">
                    Edit Profile
                  </h1>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </main>
    </>
  );
}
