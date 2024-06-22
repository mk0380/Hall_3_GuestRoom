const { useContext } = require("react");
const { useRouter } = require("next/router");
const { LoggedInUser } = require("@/context/UserContext");
const axios = require("axios");

const useCheckLoggedIn = () => {
  const { setAdmin } = useContext(LoggedInUser);
  const router = useRouter();

  const checkLoggedIn = async (route_1, route_2) => {
    try {
      const { data } = await axios.get("/api/register");
      if (data?.success ?? false) {
        setAdmin(data.payload.user);
        router.push(route_2);
      } else {
        router.push(route_1);
      }
    } catch (error) {
      console.error(`Error checking login status: ${error.message}`);
      router.push(route_1);
    }
  };

  return { checkLoggedIn };
};

export default useCheckLoggedIn;
