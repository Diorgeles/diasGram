import { createAppContainer, createStackNavigator } from "react-navigation";

import Main from "~/pages/Main";
import Feed from "~/pages/Feed";
import New from "~/pages/New";

const Routes = createAppContainer(
  createStackNavigator(
    { Feed, New },
    {
      defaultNavigationOptions: {
        headerTitle: "Insta"
      },
      mode: "modal"
    }
  )
);

export default Routes;
