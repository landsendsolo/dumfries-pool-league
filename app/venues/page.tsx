export const metadata = {
  title: "Venues | Dumfries Pool League",
};

const venues = [
  {
    name: "Abbey Inn",
    address: "Abbey Lane, Lincluden",
    town: "Dumfries",
    postcode: "DG2 0DQ",
  },
  {
    name: "Lochside Tavern",
    address: "Carrick Road",
    town: "Dumfries",
    postcode: "DG2 9PR",
  },
  {
    name: "The Pleuchie's Howff",
    address: "97 Annan Road",
    town: "Dumfries",
    postcode: "DG1 3EW",
  },
  {
    name: "Normandy Bar",
    address: "156 Troqueer Road",
    town: "Dumfries",
    postcode: "DG2 7DF",
  },
  {
    name: "The Coachman Bar",
    address: "2-3 High Street",
    town: "Moffat",
    postcode: "DG10 9ET",
  },
];

export default function VenuesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Venues</h1>
        <p className="text-gray-400 text-sm mt-1">
          All venues hosting league matches
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((venue) => (
          <div
            key={venue.name}
            className="bg-navy-light/50 border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {venue.name}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {venue.address}
                </p>
                <p className="text-gray-400 text-xs">
                  {venue.town}, {venue.postcode}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
