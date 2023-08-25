import Ably from "ably";

type ConnectedUsersProps = {
  users: Ably.Types.PresenceMessage[];
};

const ConnectedUsers = ({
  users,
  className = "",
  ...rest
}: ConnectedUsersProps & React.HTMLProps<HTMLDivElement>) => {
  return (
    <div {...rest} className={`flex ${className}`}>
      <h1 className="text-gray-500 mr-1">Connected:</h1>
      <ul className="comma-list">
        {users.map((user, i) => (
          <li key={i} className="text-gray-300">
            {user.data.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectedUsers;
