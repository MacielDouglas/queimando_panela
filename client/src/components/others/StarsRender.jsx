import { IoStarOutline, IoStarSharp } from "react-icons/io5";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export default function StarsRender({ rating, userRating, setUserRating }) {
  const [displayRating, setDisplayRating] = useState(userRating || rating || 0);

  useEffect(() => {
    if (rating === 0 || rating === null) {
      setDisplayRating(userRating);
    } else {
      setDisplayRating(rating);
    }
  }, [rating, userRating]);

  const handleClick = (index) => {
    const newRating = index + 1;
    setUserRating(newRating);
    setDisplayRating(newRating);
  };

  return (
    <>
      {Array(5)
        .fill()
        .map((_, index) =>
          index < displayRating ? (
            <IoStarSharp
              key={`full-${index}`}
              className="text-yellow-400"
              onClick={() => handleClick(index)}
            />
          ) : (
            <IoStarOutline
              key={`empty-${index}`}
              className="text-yellow-400"
              onClick={() => handleClick(index)}
            />
          )
        )}
    </>
  );
}

StarsRender.propTypes = {
  rating: PropTypes.number,
  userRating: PropTypes.number,
  setUserRating: PropTypes.func,
};

// import { IoStarOutline, IoStarSharp } from "react-icons/io5";
// import PropTypes from "prop-types";

// export default function StarsRender({ rating, setUserRating }) {
//   const fullStars = Math.floor(`${rating ? rating : 0}`);
//   const emptyStars = 5 - fullStars;
//   const handleClick = (index) => {
//     console.log(index + 1);
//     setUserRating(index);
//   };

//   console.log(rating);
//   return (
//     <>
//       {Array(fullStars)
//         .fill()
//         .map((_, index) => (
//           <IoStarSharp
//             key={`full-${index}`}
//             className="text-yellow-400 "
//             onClick={() => handleClick(index)}
//           />
//         ))}
//       {Array(emptyStars)
//         .fill()
//         .map((_, index) => (
//           <IoStarOutline
//             key={`empty-${index}`}
//             className="text-yellow-400"
//             onClick={() => handleClick(index)}
//           />
//         ))}
//     </>
//   );
// }

// StarsRender.propTypes = {
//   rating: PropTypes.number,
//   setUserRating: PropTypes.func,
// };
