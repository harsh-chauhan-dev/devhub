import { useEffect, useState } from "react";
import { ExternalLink, GitBranch, Users, Search } from "lucide-react";
import Card from "../common/Card";
import GithubIcon from "../common/GithubIcon";
import { githubService } from "../../services/githubService";
import { useAuth } from "../../hooks/useAuth";

const GithubWidget = () => {
  const { user } = useAuth();
  const activeUser = user?.githubUsername || "developer";
  const [username, setUsername] = useState(activeUser);
  const [searchInput, setSearchInput] = useState(activeUser);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGithubData = async (targetUser) => {
    setLoading(true);
    try {
      const p = await githubService.getUserProfile(targetUser);
      const r = await githubService.getUserRepos(targetUser);
      setProfile(p);
      setRepos(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleUser = user?.githubUsername || "developer";
    setUsername(handleUser);
    setSearchInput(handleUser);
    fetchGithubData(handleUser);
  }, [user?.githubUsername]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
      fetchGithubData(searchInput.trim());
    }
  };

  return (
    <Card
      title={
        <span className="flex items-center gap-2 text-[#F8FAFC]">
          <GithubIcon size={18} className="text-[#38BDF8]" />
          GitHub Live Profile
        </span>
      }
    >
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="GitHub username..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-[12px] bg-[#111827] border border-[#334155] text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none focus:border-[#4F7CFF]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#4F7CFF] hover:bg-[#3B6EF6] text-white text-xs px-3.5 py-2 rounded-[12px] font-semibold transition duration-200"
        >
          Fetch
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-[#4F7CFF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : profile ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-12 h-12 rounded-[12px] border-2 border-[#4F7CFF] object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-[#F8FAFC] truncate flex items-center gap-1.5">
                {profile.name}
                <a
                  href={profile.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#94A3B8] hover:text-[#38BDF8]"
                >
                  <ExternalLink size={14} />
                </a>
              </h3>
              <p className="text-xs text-[#94A3B8] truncate">
                @{profile.username}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center bg-[#111827] p-3 rounded-[12px] border border-[#334155]">
            <div>
              <p className="text-[11px] text-[#94A3B8] font-medium">Repos</p>
              <h4 className="font-bold text-sm text-[#38BDF8]">
                {profile.publicRepos}
              </h4>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] font-medium">Followers</p>
              <h4 className="font-bold text-sm text-[#38BDF8]">
                {profile.followers}
              </h4>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] font-medium">Following</p>
              <h4 className="font-bold text-sm text-[#38BDF8]">
                {profile.following}
              </h4>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
              Recent Repositories
            </h4>
            <div className="space-y-1.5">
              {repos.slice(0, 3).map((repo) => (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#111827]/60 hover:bg-[#111827] border border-[#334155]/50 hover:border-[#4F7CFF]/50 transition duration-200 text-xs"
                >
                  <span className="font-semibold text-[#4F7CFF] hover:underline truncate">
                    {repo.name}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                    <GitBranch size={12} /> {repo.language}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default GithubWidget;
